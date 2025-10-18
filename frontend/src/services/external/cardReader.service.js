const CARD_READER_URL = import.meta.env.VITE_CARD_READER_URL || 'http://127.0.0.1:42001'
const READ_CARD_API_URL = `${CARD_READER_URL}/read-card`
const STATUS_STREAM_API_URL = `${CARD_READER_URL}/status-stream`
const RECONNECT_INTERVAL = 3000

let eventSource = null
let hasCardBeenReadSinceInserted = false
let isPollingPaused = false
// let lastPollingArgs = null // Unused variable

/**
 * Connects to the card reader's status stream using Server-Sent Events (SSE).
 * @param {object} callbacks - Callbacks for handling events.
 * @param {(data: object) => void} callbacks.onData - Called when new card data is read.
 * @param {(status: {text: string, color: string}) => void} callbacks.onStatusChange - Called when the connection status changes.
 * @param {(error: Error | null) => void} callbacks.onError - Called when an error occurs.
 */
export function startPolling({ onData, onStatusChange, onError }) {
  // lastPollingArgs = { onData, onStatusChange, onError } // Unused variable
  isPollingPaused = false
  
  // Reset สถานะการอ่านบัตรเมื่อเริ่ม polling ใหม่
  hasCardBeenReadSinceInserted = false

  if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
    return
  }

  onStatusChange({ text: 'กำลังเชื่อมต่อ Bridge Server (SSE)...', color: 'text-yellow-500' })

  eventSource = new EventSource(STATUS_STREAM_API_URL)

  eventSource.onopen = () => {
    // console.log('[SSE] เชื่อมต่อ Bridge Server สำเร็จ')
  }

  eventSource.onerror = (err) => {
    console.error('[SSE] ข้อผิดพลาดในการเชื่อมต่อ:', err)
    eventSource.close()
    
    // ตรวจสอบสถานะการเชื่อมต่อ
    if (eventSource.readyState === EventSource.CLOSED) {
      onStatusChange({ text: 'ไม่สามารถเชื่อมต่อกับ Bridge Server ได้', color: 'text-red-500' })
      onError(new Error('ไม่สามารถเชื่อมต่อกับ Bridge Server ได้ กรุณาตรวจสอบว่า Bridge Server ทำงานอยู่ที่ http://127.0.0.1:42001'))
    } else {
      onStatusChange({ text: 'การเชื่อมต่อ Bridge Server หลุด', color: 'text-red-500' })
      onError(new Error(`กำลังพยายามเชื่อมต่อใหม่ใน ${RECONNECT_INTERVAL / 1000} วินาที...`))
    }
    
    if (!isPollingPaused) {
      setTimeout(() => startPolling({ onData, onStatusChange, onError }), RECONNECT_INTERVAL)
    }
  }

  eventSource.onmessage = (event) => {
    try {
      const statusData = JSON.parse(event.data)
      handleStatusUpdate(statusData, { onData, onStatusChange, onError })
    } catch (error) {
      console.error('[SSE] ข้อผิดพลาดในการแยกวิเคราะห์ JSON:', error, 'Raw Data:', event.data)
      onStatusChange({ text: 'ได้รับข้อมูลสถานะไม่ปกติ', color: 'text-yellow-500' })
    }
  }

  // บังคับอ่านบัตรทันทีเมื่อเริ่ม polling
  setTimeout(() => {
    triggerReadCard(onError)
  }, 500)
}

function handleStatusUpdate(statusData, { onData, onStatusChange, onError }) {
  const { status_code, message, data: cardData } = statusData
  let statusTag = 'info'
  // let icon = 'info' // Unused variable

  // Clear previous error on any new status update
  onError(null)

  switch (status_code) {
    case 'CARD_PRESENT':
      if (!hasCardBeenReadSinceInserted) {
        triggerReadCard(onError) // Attempt to read automatically
        statusTag = 'warning'
      } else {
        statusTag = 'success'
      }
      break

    case 'READER_READY':
    case 'IDLE':
    case 'NO_READER':
      hasCardBeenReadSinceInserted = false // Reset on card removal or reader disconnect
      statusTag = status_code === 'NO_READER' ? 'error' : 'info'
      // ส่งสถานะไปยัง UI เพื่อให้หยุดการอ่านบัตร
      onStatusChange({ text: `[${status_code}] ${message}`, color: `text-${statusTag}-500` })
      break

    case 'READING':
      statusTag = 'loading'
      break

    case 'READ_SUCCESS':
      if (cardData && cardData.id_number) {
        statusTag = 'success'
        hasCardBeenReadSinceInserted = true
        onData(cardData)
      }
      break

    case 'CARD_FAILURE':
    case 'READER_ERROR':
    case 'SYSTEM_ERROR':
      statusTag = 'error'
      hasCardBeenReadSinceInserted = false
      onError(new Error(message))
      break
  }

  onStatusChange({ text: `[${status_code}] ${message}`, color: `text-${statusTag}-500` })
  
  // ส่งสถานะเพิ่มเติมสำหรับการตรวจสอบการเชื่อมต่อ
  if (status_code === 'NO_READER' || status_code === 'IDLE') {
    onStatusChange({ text: `[${status_code}] ${message}`, color: `text-${statusTag}-500` })
  }
}

async function triggerReadCard(onError) {
//   console.log('[Auto-Read] Triggering card read...')
  try {
    await fetch(READ_CARD_API_URL, { signal: AbortSignal.timeout(15000) })
  } catch (error) {
    console.error('[Auto-Read Error] Failed to trigger read:', error)
    onError(new Error('ไม่สามารถส่งคำสั่งอ่านบัตรได้'))
  }
}

/**
 * Disconnects from the card reader's status stream.
 */
export function stopPolling() {
  isPollingPaused = true
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  hasCardBeenReadSinceInserted = false
  // lastPollingArgs = null // Unused variable
}

/**
 * Resets the status to its initial state.
 */
export function resetStatus({ onStatusChange }) {
  onStatusChange({ text: 'ไม่ได้เชื่อมต่อ', color: 'text-gray-500' })
}

/**
 * Manually triggers a card read and returns the data.
 * @throws {Error} If the read fails or times out.
 */
export async function manualReadCard() {
    try {
        // This function now only triggers the read. The result will be handled by the SSE onmessage handler.
        const response = await fetch(READ_CARD_API_URL, { signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('ไม่สามารถส่งคำสั่งอ่านบัตรได้');
    } catch (error) {
        throw new Error(error.message || 'ไม่สามารถเชื่อมต่อกับเครื่องอ่านบัตรได้');
    }
}

/**
 * Triggers a manual card read and returns a promise that resolves with the card data.
 * This function listens to the SSE stream for a single successful read event.
 * @returns {Promise<object>} A promise that resolves with the card data.
 * @throws {Error} If the read fails or times out.
 */
export function manualReadCardOnce() {
    return new Promise((resolve, reject) => {
        const tempEventSource = new EventSource(STATUS_STREAM_API_URL);

        const timeout = setTimeout(() => {
            tempEventSource.close();
            reject(new Error('หมดเวลาในการอ่านบัตร (Timeout)'));
        }, 20000); // 20 seconds timeout

        tempEventSource.onopen = () => {
            manualReadCard() // Trigger the read
                .then(() => {
                    // Read triggered successfully
                })
                .catch((error) => {
                    tempEventSource.close();
                    clearTimeout(timeout);
                    reject(error);
                });
        };

        tempEventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.status_code === 'READ_SUCCESS' && data.data) {
                tempEventSource.close();
                clearTimeout(timeout);
                resolve(data.data);
            } else if (data.status_code === 'READ_ERROR' || data.status_code === 'CARD_FAILURE') {
                tempEventSource.close();
                clearTimeout(timeout);
                reject(new Error(data.message || 'ไม่สามารถอ่านข้อมูลจากบัตรได้'));
            }
        };

        tempEventSource.onerror = (err) => {
            tempEventSource.close();
            clearTimeout(timeout);
            console.error('[SSE] Manual Read Error:', err);
            reject(new Error('ไม่สามารถเชื่อมต่อกับ Bridge Server ได้'));
        };
    });
}