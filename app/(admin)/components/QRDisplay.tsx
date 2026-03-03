'use client'
import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export default function QRDisplay({ data }: { data: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return
    QRCode.toCanvas(canvasRef.current, data, {
      width: 160,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
  }, [data])

  return (
    <div className="inline-block bg-white p-2 rounded-xl">
      <canvas ref={canvasRef} />
    </div>
  )
}
