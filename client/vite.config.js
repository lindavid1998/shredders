import { defineConfig } from 'vite'
import dns from 'dns';
import react from '@vitejs/plugin-react'

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		// host: 'localhost',
		// port: 5100,
		watch: {
			usePolling: true, 
		},
	},
});
