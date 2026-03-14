import supabase from './supabaseClient.js';

async function test() {
  const { data: b } = await supabase.from('branches').select('*').limit(1);
  console.log('Branches columns:', Object.keys(b[0] || {}));
  console.log('Branch 0:', b[0]);

  const { data: u } = await supabase.from('users').select('*').limit(1);
  console.log('Users columns:', Object.keys(u[0] || {}));
  console.log('User 0:', u[0]);
}

test();
