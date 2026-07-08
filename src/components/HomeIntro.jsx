import useIntroMode from '../hooks/useIntroMode'
import Hero from './Hero'
import IntroScrub from './IntroScrub'

export default function HomeIntro() {
  const mode = useIntroMode()
  return mode === 'scrub' ? <IntroScrub /> : <Hero />
}
