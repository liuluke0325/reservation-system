import axios from "axios"
import '../fixtures/fixture'

type ReversePayloadProps = { code: string, email: string, walletAddress: string, signature: string }

export const api = {
    verifyCode: (code: string) => {
        return axios.get(`/api/verifyCode?code=${code}`).then(res => res.data);
    },
    isEmailUsed: (email: string) => {
        return axios.get(`/api/isEmailUsed?email=${email}`).then(res => res.data);
    },
    isWalletUsed: (wallet: string) => {
        return axios.get(`/api/isWalletUsed?wallet=${wallet}`).then(res => res.data);
    },
    // true mean success, false means fail
    reverse: (payload: ReversePayloadProps) => {
        return axios.post<boolean>(`/api/reserve`, payload).then(res => res.data);
    },



}