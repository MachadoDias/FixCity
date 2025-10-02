import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface NotificationData {
  type: string
  data: any
}

export const useNotifications = () => {
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    // Conectar ao SSE
    const eventSource = new EventSource('http://localhost:5000/api/events')
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const notification: NotificationData = JSON.parse(event.data)
        
        if (notification.type === 'new_demand') {
          const demand = notification.data
          toast.success(
            `🆕 Nova demanda registrada!\n${demand.title} - ${demand.location}`,
            {
              duration: 5000,
              style: {
                background: '#10B981',
                color: 'white',
              },
            }
          )
          
          // Disparar evento customizado para atualizar listas
          window.dispatchEvent(new CustomEvent('newDemand', { detail: demand }))
        }
      } catch (error) {
        console.error('Erro ao processar notificação:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('Erro na conexão SSE:', error)
    }

    // Cleanup
    return () => {
      eventSource.close()
    }
  }, [])

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN
  }
}