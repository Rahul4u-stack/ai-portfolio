import { render, screen } from '@testing-library/react'
import VideoEmbed from '../components/ui/VideoEmbed'

const VIDEO_URL = '/video/video-resume.mp4'
const POSTER_URL = '/video/video-resume-poster.webp'

describe('VideoEmbed', () => {
  it('renders nothing when videoUrl is not set', () => {
    const { container } = render(<VideoEmbed title="AI Video Resume" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a video element with preload="none" and no autoplay', () => {
    const { container } = render(
      <VideoEmbed videoUrl={VIDEO_URL} posterUrl={POSTER_URL} title="AI Video Resume" />
    )
    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute('preload', 'none')
    expect(video).not.toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('src', VIDEO_URL)
    expect(video).toHaveAttribute('poster', POSTER_URL)
    expect(video).toHaveAttribute('controls')
  })
})
