const CHANGE_PART='CHANGE_PART'

export default {
	[CHANGE_PART](state,payload){
		state.insInfoId=payload.insInfoId
	}
}
