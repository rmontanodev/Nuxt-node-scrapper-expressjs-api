export const state = () => ({
	token: '',
	userid: '',
	imgAvatar: '',
	email: '',
	productos: [],
	productorepe: false
})
export const getters = {
	getLogin(state) {
		return typeof state.token === 'string' && state.token !== ''
	},
	getToken(state) {
		return state.token
	},
	getUserId(state) {
		return state.userid
	},
	getimgAvatar(state) {
		return state.imgAvatar
	},
	getEmail(state) {
		return state.email
	},
	getProductos(state) {
		return state.productos
	},
	getProductorepe(state) {
		return state.productorepe
	},
	getimgAvatar(state) {
		return state.imgAvatar
	}
}
export const actions = {
	loginSession: function(context, data) {
		sessionStorage.setItem('session', JSON.stringify(data))
		context.commit('setSession', data)
	},
	logoutSession(context) {
		context.commit('logoutSession')
	},
	getSession(context) {
		const session = sessionStorage.getItem('session')
		if (session && typeof session === 'string' && session !== '') {
			const data = JSON.parse(session)
			context.commit('setSession', data)
		}
	},
	setRepeProduct(context, data) {
		context.commit('setRepeProd', data)
	},
	addProd(context, data) {
		context.commit('setnewProd', data)
	},
	modProd(context, data) {
		context.commit('modProdd', data)
	},
	Updatemail(context, data) {
		context.commit('updateemail', data)
	},
	setProductoss(context, data) {
		context.commit('setproductos', data)
	}
}
export const mutations = {
	setSession(state, n) {
		state.token = n.token
		state.userid = n.userid
		state.imgAvatar = n.imgAvatar
		state.email = n.email
		state.productos = n.productos
	},
	logoutSession(state) {
		sessionStorage.clear()
		state.token = ''
		state.userid = ''
		state.imgAvatar = ''
		state.email = ''
		state.productos = []
	},
	setRepeProd(state, data) {
		state.productorepe = data
	},
	setnewProd(state, data) {
		state.productos.producto.push(data)
	},
	modProdd(state, data) {
		state.productos.producto[data[2]].error = data[0]
		state.productos.producto[data[2]].errormsg = data[1]
	},
	updateemail(state, data) {
		state.email = data
	},
	setproductos(state, data) {
		state.productos.producto.splice(data, 1)
	}
}
