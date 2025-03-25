export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "niki-vis-5609/_app",
	assets: new Set([".DS_Store","3d/.DS_Store","3d/Flamingo.glb","3d/Horse.glb","3d/Parrot.glb","3d/grasslight-big.jpg","3d/helvetiker_bold.typeface.json","3d/sky.jpg","3d/wood-texture.jpg","favicon.png","summer_movies.csv"]),
	mimeTypes: {".glb":"model/gltf-binary",".jpg":"image/jpeg",".json":"application/json",".png":"image/png",".csv":"text/csv"},
	_: {
		client: {start:"_app/immutable/entry/start.ClBS3ihX.js",app:"_app/immutable/entry/app.BIFDO31h.js",imports:["_app/immutable/entry/start.ClBS3ihX.js","_app/immutable/chunks/4zZNW8kR.js","_app/immutable/chunks/BPI7EAEX.js","_app/immutable/chunks/CcWPcRKx.js","_app/immutable/chunks/b1ufZUxi.js","_app/immutable/entry/app.BIFDO31h.js","_app/immutable/chunks/BPI7EAEX.js","_app/immutable/chunks/ByDB1ul6.js","_app/immutable/chunks/DcyT26n5.js","_app/immutable/chunks/D84Utw2H.js","_app/immutable/chunks/CdYTcLjg.js","_app/immutable/chunks/DfZPznz0.js","_app/immutable/chunks/b1ufZUxi.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/A0",
				pattern: /^\/A0\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/A1",
				pattern: /^\/A1\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/A2",
				pattern: /^\/A2\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/A3",
				pattern: /^\/A3\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
