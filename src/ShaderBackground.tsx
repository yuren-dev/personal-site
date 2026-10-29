import { useEffect, useRef } from 'react'

/*
 * Faint backdrop, inspired by nasana's "glowingMarblingBlack" on Shadertoy
 * (https://www.shadertoy.com/view/WtdXR8). The marble warp is kept, but the
 * playback is slowed to about a fifth of real time, the canvas is rendered
 * at half resolution, and CSS blur + low opacity + a white veil keep it
 * firmly in the background. If WebGL is unavailable, or the user prefers
 * reduced motion, the page simply stays white.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / min(uRes.x, uRes.y);
  // Slow marble warp: the same cosine-warp idea, at 0.22x time.
  float t = uTime * 0.22;
  for (float i = 1.0; i < 10.0; i++) {
    uv.x += 0.6 / i * cos(i * 2.5 * uv.y + t);
    uv.y += 0.6 / i * cos(i * 1.5 * uv.x + t);
  }
  vec3 col = vec3(0.1) / abs(sin(t - uv.y - uv.x));
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) ?? 'shader compile failed')
  }
  return sh
}

export default function ShaderBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return // graceful fallback: plain white background

    let program: WebGLProgram
    try {
      program = gl.createProgram()!
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'shader link failed')
      }
    } catch {
      return
    }

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(program, 'uRes')
    const uTime = gl.getUniformLocation(program, 'uTime')
    gl.useProgram(program)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let start = performance.now()
    let hiddenSince = 0
    let stopped = false

    const resize = () => {
      // Half resolution on purpose: the blur below hides the softness,
      // and it roughly quarters the GPU cost.
      const dpr = 0.5
      canvas.width = Math.max(2, Math.floor(window.innerWidth * dpr))
      canvas.height = Math.max(2, Math.floor(window.innerHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const frame = (now: number) => {
      if (stopped) return
      const t = reduced ? 0.8 : (now - start) / 1000
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduced && !document.hidden) raf = requestAnimationFrame(frame)
    }
    if (reduced) {
      frame(start) // one static frame, no loop
    } else {
      raf = requestAnimationFrame(frame)
    }

    const onVis = () => {
      if (document.hidden) {
        hiddenSince = performance.now()
        cancelAnimationFrame(raf)
      } else if (hiddenSince) {
        // Shift the clock so hidden time does not make the marble jump.
        start += performance.now() - hiddenSince
        hiddenSince = 0
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <div className="shader-wrap" aria-hidden="true">
      <canvas ref={ref} className="shader-canvas" />
      <div className="shader-veil" />
    </div>
  )
}
