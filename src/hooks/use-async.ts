"use client"

import { useState, useCallback } from "react"

type AsyncState<T> = {
  data: T | null
  error: Error | null
  isLoading: boolean
}

export const useAsync = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  })

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState({ data: null, error: null, isLoading: true })
    try {
      const data = await asyncFn()
      setState({ data, error: null, isLoading: false })
      return data
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, error: err, isLoading: false })
      throw err
    }
  }, [])

  return { ...state, execute }
}
