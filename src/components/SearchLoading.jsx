import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const SearchLoading = () => {
  return (
    <div>
        <Stack>
            <Skeleton height='30px' />
            <Skeleton height='30px' />
            <Skeleton height='30px' />
            <Skeleton height='30px' />
            <Skeleton height='30px' />
            <Skeleton height='30px' />            
            <Skeleton height='30px' />
            <Skeleton height='30px' />
            <Skeleton height='30px' />           
            <Skeleton height='30px' />
            <Skeleton height='30px' />           
            <Skeleton height='30px' />
        </Stack>
    </div>
  )
}

export default SearchLoading
