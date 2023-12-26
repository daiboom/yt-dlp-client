'use client'
import { exec } from 'child_process'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react'

const download = async () => {
  await exec('ls -al', (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`)
      return
    }

    console.log(`Number of files ${stdout}`)
    console.log(`stderr Number of files ${stderr}`)
  })
}

export default function Home() {
  // exec(
  //   'yt-dlp https://www.youtube.com/watch?v=MxnpzgfDt-Q&t=118s',
  //   (err, stdout, stderr) => {
  //     if (err) {
  //       console.error(`exec error: ${err}`)
  //       return
  //     }

  //     console.log(`Number of files ${stdout}`)
  //     console.log(`stderr Number of files ${stderr}`)
  //   }
  // )
  return (
    <Box>
      <Container>
        <FormControl>
          <FormLabel>Enter the Youtube Link</FormLabel>
          <Flex>
            <Input
              type="text"
              size={'sm'}
              sx={{ borderRadius: '0.375rem', marginRight: '0.375rem' }}
            />
            <Button
              size={'sm'}
              onClick={async () => {
                await download()
              }}
            >
              Download
            </Button>
          </Flex>
          <FormHelperText>We&apos;ll never share your email.</FormHelperText>
        </FormControl>
      </Container>
    </Box>
  )
}
