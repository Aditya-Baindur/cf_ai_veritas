import { redirect } from 'next/navigation'

export default function GitHubRedirect() {
  const ghLnk =
    process.env.GITHUB ?? 'https://github.com/Aditya-Baindur/cf_ai_veritas'
  redirect(ghLnk)
}
