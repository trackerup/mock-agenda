import { setters } from '../../persistence/services'

export default {
  async synchronization (loginSincData, synchronization) {
    setters.setOne('user', loginSincData.user)
    await synchronization.$store.dispatch('user/updateUser', {
      user: loginSincData.user
    })
  }
}
