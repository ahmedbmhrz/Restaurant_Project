import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { supabase } from './lib/supabase.js'

let currentUserId = null;
let selfHealPromise = null;

const selfHealUser = async (session) => {
    if (!session?.user) return null;
    const userId = session.user.id;
    
    // Check local session storage first
    const cachedId = sessionStorage.getItem(`company_id_${userId}`);
    if (cachedId) return cachedId;
    
    try {
        // Query the public.users table to see if user profile exists
        const { data: dbUser, error } = await supabase
            .from('users')
            .select('company_id')
            .eq('id', userId)
            .maybeSingle();
            
        if (dbUser?.company_id) {
            sessionStorage.setItem(`company_id_${userId}`, dbUser.company_id);
            return dbUser.company_id;
        }
        
        // Self-Healing Phase: User profile or company link is missing!
        console.warn(`[Self-Healing] User profile missing for ${userId}. Provisioning clean tenant...`);
        
        let companyId = session.user.user_metadata?.company_id;
        const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "HQ Manager";
        
        if (!companyId) {
            // Create a brand new company for the orphan user
            const { data: newCompany, error: compErr } = await supabase
                .from('companies')
                .insert([{ name: `${fullName}'s Restaurant Group` }])
                .select()
                .single();
                
            if (compErr) throw compErr;
            companyId = newCompany.id;
            
            // Update auth metadata
            await supabase.auth.updateUser({
                data: { company_id: companyId }
            });
        }
        
        // Insert public.users profile
        const { error: userErr } = await supabase
            .from('users')
            .insert([{
                id: userId,
                full_name: fullName,
                role: 'HQ_Admin',
                company_id: companyId
            }]);
            
        if (userErr) {
            // If they already exist in database (race condition), ignore error
            if (userErr.code !== '23505') throw userErr;
        }
        
        sessionStorage.setItem(`company_id_${userId}`, companyId);
        console.log(`[Self-Healing] Successfully provisioned tenant ${companyId} for user ${userId}`);
        return companyId;
    } catch (err) {
        console.error("[Self-Healing] Failed to auto-provision user:", err);
        return session.user.user_metadata?.company_id || null;
    }
};

// Global Fetch Interceptor to inject SaaS Tenant ID and rewrite API URLs
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    let [resource, config] = args;
    
    if (typeof resource === 'string' && (resource.startsWith('/api') || resource.startsWith('http://localhost:5000/api'))) {
        
        // --- API URL Rewriting Logic ---
        const isElectron = navigator.userAgent.toLowerCase().includes('electron');
        const isDev = import.meta.env.DEV;
        
        // If Electron Prod -> use Render URL
        // If Web Prod -> use relative paths (Render handles it)
        const API_BASE_URL = isElectron && !isDev 
            ? 'https://nexus-fullstack.onrender.com' 
            : (!isElectron && !isDev ? '' : 'http://localhost:5000');

        if (resource.startsWith('http://localhost:5000')) {
            // Replace localhost with our target base URL (which might be empty string for relative paths in web prod)
            resource = resource.replace('http://localhost:5000', API_BASE_URL);
        } else if (resource.startsWith('/api') && isElectron) {
            // If it's a relative path in electron, we MUST make it absolute
            resource = API_BASE_URL + resource;
        }
        // --------------------------------

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            if (currentUserId !== session.user.id) {
                currentUserId = session.user.id;
                selfHealPromise = selfHealUser(session);
            }
            const companyId = await selfHealPromise;
            
            if (companyId) {
                config = config || {};
                config.headers = {
                    ...config.headers,
                    'X-Company-Id': companyId
                };
            }
        }
    }
    return originalFetch(resource, config);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
