'use client'

import {
  download,
  getDownloadFiles,
  getOs,
  installBrewUsingShell,
  installYtDlpUsingBrew,
} from '@/app/actions'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  ListItem,
  OrderedList,
  Spacer,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

type OutputBrowseUi = () => JSX.Element
type UseOutputBrowse = (props: { browsePath?: string }) => [
  OutputBrowseUi,
  {
    reload: () => Promise<void>
  }
]

const useOutputBrowse: UseOutputBrowse = ({ browsePath }) => {
  const [list, setList] = useState<string[]>()
  const load = useCallback(async () => {
    try {
      const data = await getDownloadFiles(browsePath)

      if (data) {
        const list = data.split('\n').filter((item: string) => !!item)
        setList(list)
      }
    } catch (error) {
      setList(undefined)
    }
  }, [browsePath])

  const OutputBrowse = useCallback(() => {
    return (
      <>
        <Button size={'sm'} sx={{ width: '100%' }} onClick={load}>
          view download folder
        </Button>
        <OrderedList
          sx={{
            fontSize: '12px',
          }}
        >
          {list &&
            list?.map((item) => {
              return <ListItem key={item}>{item}</ListItem>
            })}
        </OrderedList>
      </>
    )
  }, [list, load])

  return [OutputBrowse, { reload: load }]
}

function InstallHelper() {
  const [adminPassword, setAdminPassword] = useState<string>()
  const { isOpen, onToggle } = useDisclosure()

  return (
    <>
      <Button onClick={onToggle} colorScheme="messenger" variant="link">
        {isOpen ? 'close' : 'open'} install helper
      </Button>
      {isOpen && (
        <>
          <FormControl>
            <FormLabel>Admin password</FormLabel>
            <Flex>
              <Input
                type="text"
                size={'sm'}
                onChange={(event) => {
                  setAdminPassword(event.target.value)
                }}
                sx={{ borderRadius: '0.375rem', marginRight: '0.375rem' }}
              />
            </Flex>
          </FormControl>
          <Stack sx={{ gab: '1', mt: 1 }}>
            <Button
              sx={{
                width: '100%',
              }}
              onClick={async () => {
                adminPassword && (await installBrewUsingShell(adminPassword))
              }}
            >
              install brew
            </Button>
            <Button
              sx={{
                width: '100%',
              }}
              onClick={async () => {
                await installYtDlpUsingBrew()
              }}
            >
              install yt-dlp using brew
            </Button>
          </Stack>
        </>
      )}
    </>
  )
}

// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>()
  const [outputPath, setOutputPath] = useState<string>()
  const [OutputBrowse, { reload }] = useOutputBrowse({
    browsePath: outputPath,
  })

  useEffect(() => {
    const os = getOs()
    os.then((data) => {
      console.log(os)
    })
  }, [])

  return (
    <Box>
      <Heading
        sx={{
          textAlign: 'center',
          color: 'rgba(255,0,0,0.8)',
          fontSize: '24px',
          fontWeight: 'semiBold',
          p: '10px 0 10px',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        yt-dlp client
      </Heading>
      <Container sx={{ py: 4 }}>
        <Stack sx={{ gap: '2' }}>
          <FormControl>
            <FormLabel>Enter the YouTube link</FormLabel>
            <Input
              type="text"
              size={'sm'}
              sx={{ borderRadius: '0.375rem', marginRight: '0.375rem' }}
              onChange={(event) => {
                setVideoUrl(event.target.value)
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel>(Optional)Enter the directory to output</FormLabel>
            <Flex>
              <Input
                type="text"
                size={'sm'}
                sx={{ borderRadius: '0.375rem', marginRight: '0.375rem' }}
                onChange={(event) => {
                  setOutputPath(event.target.value)
                }}
              />
            </Flex>
          </FormControl>
          <Button
            size={'sm'}
            onClick={async () => {
              if (videoUrl) {
                await download({
                  videoUrl,
                  options: {
                    output: outputPath,
                  },
                })
                await reload()
              }
            }}
            sx={{ width: '100%' }}
          >
            Download
          </Button>
        </Stack>
        <Spacer h={'4'} />
        <OutputBrowse />
        <InstallHelper />
      </Container>
    </Box>
  )
}
