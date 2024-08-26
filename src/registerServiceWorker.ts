const publicVapidKey =
  'BOc4XoWWX6ggheu3H-HYmkmnPA4wX5np-TqUuIcfqilxt3UCHWPUMB1ch36jYBoeuJ6yJxWeEVvzGVg07dkEoZM'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration: ServiceWorkerRegistration) => {
      console.log('Service Worker registrado com sucesso:', registration)

      if (!('PushManager' in window)) {
        throw new Error('Push messaging não é suportado.')
      }

      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })
    })
    .then((subscription: PushSubscription) => {
      // Enviar a inscrição para o servidor
      //url do back-end
      return fetch('https://localhost:7127/api/Notification/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Falha ao enviar a inscrição para o servidor.')
      }
      console.log('Inscrição enviada com sucesso.')
    })
    .catch((error: Error) => {
      console.error('Falha ao registrar o Service Worker ou inscrever-se para notificações:', error)
    })
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
