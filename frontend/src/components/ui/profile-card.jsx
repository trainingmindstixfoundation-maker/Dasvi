import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { Play, Check } from "lucide-react"
import { useState, useCallback, useRef, useEffect } from "react"

/**
 * ProfileCard — Dasvi Educational Platform
 * 
 * Premium image-based card with:
 * - Full theme support (Dasvi CSS vars for light/dark)
 * - Hover-only controls: stats slide up, play button pops in
 * - Play button click → ripple grow + fade → page navigation
 * - No always-visible button; card click navigates directly
 */
export function ProfileCard({
  name = "",
  description = "",
  image = "",
  isVerified = false,
  followers = 0,
  following = 0,
  enableAnimations = true,
  className = "",
  /* ── Educational extensions ── */
  followersLabel = "modules",
  followingLabel = "videos",
  followersIcon: FollowersIcon,
  followingIcon: FollowingIcon,
  buttonLabel = "Explore →",
  onClick,
  onFollow,
}) {
  const [hovered, setHovered] = useState(false)
  const [ripple, setRipple] = useState(false)
  const [imgError, setImgError] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion
  const cardRef = useRef(null)

  useEffect(() => {
    setImgError(false)
  }, [image])

  const handleNavigate = useCallback(() => {
    const nav = onClick || onFollow
    if (nav) nav()
  }, [onClick, onFollow])

  const handlePlayClick = useCallback((e) => {
    e.stopPropagation()
    if (ripple) return
    setRipple(true)
    // After ripple animation completes, navigate
    setTimeout(() => {
      handleNavigate()
    }, 500)
  }, [handleNavigate, ripple])

  // ─── Card container style (inline CSS vars) ───
  const cardStyle = {
    borderRadius: '24px',
    border: '1px solid var(--border-subtle)',
    boxShadow: hovered ? 'var(--neon-blue-hover-glow)' : 'var(--glass-shadow)',
    transition: 'box-shadow 0.4s ease',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '320px',
  }

  return (
    <motion.div
      ref={cardRef}
      data-slot="profile-hover-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleNavigate}
      initial={{ scale: 1, y: 0 }}
      whileHover={{}}
      className={className}
      style={cardStyle}
    >
      {/* ── Cover Image or Context-Relative Fallback Icon ── */}
      {!image || imgError ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 30%, var(--brand-accent) 0%, var(--bg-secondary) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '90px',
            color: 'var(--brand-primary)',
            borderBottom: '1px solid var(--border-subtle)'
          }}
          title={name || followersLabel || 'Educational Resource'}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 12px 30px -8px rgba(59, 130, 246, 0.5)',
              marginBottom: '14px',
              transition: 'transform 0.3s ease'
            }}
          >
            {FollowersIcon ? <FollowersIcon size={38} strokeWidth={2} /> : <Play size={38} strokeWidth={2} />}
          </div>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-heading)',
              padding: '6px 14px',
              background: 'rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(4px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {followersLabel || 'Educational Resource'}
          </span>
        </div>
      ) : (
        <motion.img
          src={image}
          alt={name}
          loading="lazy"
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      )}

      {/* ── Gradient overlay — uses CSS vars for theme ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(
          to top,
          var(--bg-primary) 0%,
          var(--bg-primary) 25%,
          color-mix(in srgb, var(--bg-primary) 85%, transparent) 50%,
          color-mix(in srgb, var(--bg-primary) 40%, transparent) 75%,
          transparent 100%
        )`,
        pointerEvents: 'none',
      }} />

      {/* ── Bottom content area ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}>
        {/* Title + Verified Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={{
            margin: 0,
            fontSize: 'clamp(1.1rem, 1rem + 0.8vw, 1.5rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--text-heading)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            textShadow: 'var(--neon-text-shadow)',
          }}>
            {name}
          </h3>
          {isVerified && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-green)',
              flexShrink: 0,
            }}>
              <Check size={11} color="#fff" strokeWidth={3} />
            </span>
          )}
        </div>

        {/* Description — always visible */}
        <p style={{
          margin: 0,
          fontSize: '0.84rem',
          lineHeight: 1.45,
          color: 'var(--text-secondary)',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {description}
        </p>

        {/* ── Stats row — statically visible ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingTop: '2px',
          overflow: 'hidden',
        }}>
          {FollowersIcon && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
            }}>
              <FollowersIcon size={14} style={{ color: 'var(--brand-secondary)' }} />
              <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{followers}</span>
              <span>{followersLabel}</span>
            </div>
          )}
          {FollowingIcon && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
            }}>
              <FollowingIcon size={14} style={{ color: 'var(--brand-secondary)' }} />
              <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{following}</span>
              <span>{followingLabel}</span>
            </div>
          )}
        </div>

        {/* ── CTA Button — statically visible ── */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            e.stopPropagation()
            handleNavigate()
          }}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '14px',
            border: 'none',
            background: 'var(--brand-primary)',
            color: 'var(--bg-primary)',
            fontWeight: 700,
            fontSize: '0.84rem',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            letterSpacing: '0.01em',
            transition: 'background 0.2s ease',
          }}
        >
          {buttonLabel}
        </motion.button>
      </div>

      {/* ── Play Button — top-right, statically visible ── */}
      {!ripple && (
        <motion.button
          whileHover={{ scale: 1.15, boxShadow: '0 0 20px var(--brand-secondary)' }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePlayClick}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            background: 'var(--brand-primary)',
            color: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
          aria-label="Play"
        >
          <Play size={20} fill="currentColor" />
        </motion.button>
      )}

      {/* ── Ripple Transition — grows from play button ── */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            initial={{
              scale: 0,
              opacity: 1,
              borderRadius: '50%',
            }}
            animate={{
              scale: 12,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              scale: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.15, delay: 0.35 },
            }}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--brand-primary)',
              zIndex: 20,
              pointerEvents: 'none',
              transformOrigin: 'center center',
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
