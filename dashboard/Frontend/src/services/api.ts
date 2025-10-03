const API_BASE_URL = 'http://localhost:5000/api'

export interface Demand {
  id?: number
  title: string
  description?: string
  requester: string
  requester_contact?: string
  location: string
  image_path?: string
  status?: 'pending' | 'in_progress' | 'resolved' | 'cancelled'
  created_at?: string
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // Se não conseguir parsear o JSON, usa a mensagem padrão
        }
        throw new Error(errorMessage)
      }
      
      // Para DELETE, pode não ter conteúdo JSON
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async getDemands(): Promise<Demand[]> {
    return this.request<Demand[]>('/demands')
  }

  async createDemand(demand: Omit<Demand, 'id' | 'created_at'>): Promise<Demand> {
    return this.request<Demand>('/demands', {
      method: 'POST',
      body: JSON.stringify(demand),
    })
  }

  async updateDemand(id: number, demand: Partial<Demand>): Promise<Demand> {
    return this.request<Demand>(`/demands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(demand),
    })
  }

  async getDemand(id: number): Promise<Demand> {
    return this.request<Demand>(`/demands/${id}`)
  }

  async deleteDemand(id: number): Promise<void> {
    try {
      await this.request<any>(`/demands/${id}`, {
        method: 'DELETE',
      })
    } catch (error) {
      console.error(`Error deleting demand ${id}:`, error)
      throw error
    }
  }
}

export const apiService = new ApiService()