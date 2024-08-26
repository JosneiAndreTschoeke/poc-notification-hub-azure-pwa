// Escuta o evento de push: Quando uma notificação push é recebida, exibe uma notificação com um título e corpo.
self.addEventListener('push', function (event) {
  const data = event.data
    ? event.data.json()
    : { title: 'Notificação', body: 'Você tem uma nova mensagem.' }
  const options = {
    body: data.body,
    icon: 'path/to/icon.png',
    badge: 'path/to/badge.png'
  }
  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Escuta o evento de clique na notificação: Quando o usuário clica na notificação, a aba do navegador é aberta em uma URL específica.
self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(
    self.clients.openWindow('https://www.google.com') // Colocar URL desejada
  )
})
