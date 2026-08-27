import useRevealed from '../../hooks/useRevealed'

/**
 * Restrained section-entrance animation: opacity plus a short vertical lift, nothing else.
 *
 * Two deliberate constraints:
 *  - **Never animates on the X axis.** That is what clipped full-width mobile cards off the left
 *    edge in the previous build.
 *  - **Plain CSS, no animation library.** A one-shot opacity + 12px translateY does not justify
 *    shipping ~40 kB gzipped of animation runtime on the critical path.
 *
 * Under reduced motion this renders a bare element with no transition and no transform.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 12,
  className = '',
  // Consumed here, never spread onto the DOM node.
  amount,
  safetyMs,
  style,
  ...rest
}) {
  const [ref, revealed, prefersReducedMotion] = useRevealed({
    ...(amount === undefined ? {} : { amount }),
    ...(safetyMs === undefined ? {} : { safetyMs }),
  })

  if (prefersReducedMotion) {
    return (
      <Tag ref={ref} className={className} style={style} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'none' : `translateY(${y}px)`,
        transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 500ms cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: revealed ? undefined : 'opacity, transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
