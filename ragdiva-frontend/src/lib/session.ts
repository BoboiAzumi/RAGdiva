export function setSession(token: string){
    localStorage.setItem('ragdiva-token', token)
}

export function getSession(){
    return localStorage.getItem('ragdiva-token') ?? ''
}

export function destroySession(){
    return localStorage.removeItem('ragdiva-token')
}