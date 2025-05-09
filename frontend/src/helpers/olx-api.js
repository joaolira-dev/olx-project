const BASEAPI = "https://olx-project-k5fv.onrender.com"
import Cookies from "js-cookie"
import qs from "qs"

const apiFetchPut = async (endpoint, body) => {
   if(!body.token) {
      let token = Cookies.get("token")
      if(token) {
         body.token = token
      }
   }

   const res = await fetch(BASEAPI + endpoint, {
      method: "PUT",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body:JSON.stringify(body)
   })
   const json = res.json()

   if(json.notallowed) {
      window.location.href = "/signin"
   }
   return json
}

const apiFetchPost = async (endpoint, body) => {
   if(!body.token) {
      let token = Cookies.get("token")
      if(token) {
         body.token = token
      }
   }

   const res = await fetch(BASEAPI + endpoint, {
      method: "POST",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json"
      },
      body:JSON.stringify(body)
   })
   const json = res.json()

   if(json.notallowed) {
      window.location.href = "/signin"
   }
   return json
}

const apiFetchGet = async (endpoint, body = []) => {
  if(!body.token) {
      let token = Cookies.get("token")
      if(token) {
         body.token = token
      }
   }

   const res = await fetch(`${BASEAPI + endpoint}?${qs.stringify(body)}`)
   const json = res.json()

   if(json.notallowed) {
      window.location.href = "/signin"
   }
   return json
}

const apiFetchFile = async (endpoint, body) => {
   if(!body.token) {
      let token = Cookies.get("token")
      if(token) {
         body.append("token", token)
      }
   }

   const res = await fetch(BASEAPI + endpoint, {
      method: "POST",
      body
   })
   const json = res.json()

   if(json.notallowed) {
      window.location.href = "/signin"
   }
   return json
}

const OlxApi = {
   login: async (email, password) => {
      const json = await apiFetchPost("/user/signin", {email, password})
      return json
   },
   register: async (name, email, password, stateLoc) => {
      const json = await apiFetchPost("/user/signup", {name, email, password, state: stateLoc})
      return json
   },
   getStates: async () => {
      const json = await apiFetchGet("/states")
      return json.states
   },
   getCategories: async () => {
      const json = await apiFetchGet("/categories")
      return json.categories
   },
   getAds: async (options) => {
      const json = await apiFetchGet("/ad/list", options) 
      return json
   },
   getAd: async (id, other = false ) => {
      const json = await apiFetchGet("/ad/item", {
         id, other
      })
      return json
   },
   postAd: async (fData) => {
      const json = await apiFetchFile("/ad/add", fData)
      return json
   },
   getAccount: async () => {
      const json = await apiFetchGet("/user/me")
      return json
   },
   editAccount: async (account) => {
      const json = await apiFetchPut("/user/me", {name: account.name, state: account.state, email: account.email})
      return json
   }
}

export default () => OlxApi