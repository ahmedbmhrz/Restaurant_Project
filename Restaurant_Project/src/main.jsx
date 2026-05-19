import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { supabase } from './lib/supabase.js'

// Global Fetch Interceptor to inject SaaS Tenant ID
const originalFetch = window.fetch;
window.fetch = async (...args) => {
    let [resource, config] = args;
    
    if (typeof resource === 'string' && (resource.startsWith('/api') || resource.startsWith('http://localhost:5000/api'))) {
        const { data: { session } } = await supabase.auth.getSession();
        const companyId = session?.user?.user_metadata?.company_id;
        
        console.log(`[Fetch Interceptor] Resource: ${resource} | User: ${session?.user?.id} | CompanyID: ${companyId}`);
        
        if (companyId) {
            config = config || {};
            config.headers = {
                ...config.headers,
                'X-Company-Id': companyId
            };
        }
    }
    return originalFetch(resource, config);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
