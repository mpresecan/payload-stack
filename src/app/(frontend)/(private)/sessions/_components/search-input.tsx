'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useSessionFilter } from '../_providers/filter'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchIcon, XIcon } from 'lucide-react'

export default function SearchInput() {
  const { search, setSearch } = useSessionFilter()
  const [inputValue, setInputValue] = useState(search)

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      if (value !== search) {
        setSearch(value)
      }
    }, 500),
    [setSearch]
  )

  useEffect(() => {
    debouncedSetSearch(inputValue)
  }, [inputValue, debouncedSetSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleClearSearch = () => {
    setInputValue('')
    setSearch('')
  }

  return (
    <div className="flex-1 min-w-[200px] xs:min-w-[500px]">
      <Label htmlFor="search" className="sr-only">Search</Label>
      <div className="relative">
        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          placeholder="Search sessions..."
          value={inputValue}
          onChange={handleInputChange}
          className="pl-8 pr-8"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0"
            onClick={handleClearSearch}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
