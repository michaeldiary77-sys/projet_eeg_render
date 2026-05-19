import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/eeg/dashboard')
}
