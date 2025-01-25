import * as React from "react"

// Define breakpoint for mobile devices (768px is a common tablet/mobile boundary)
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // State to track if viewport is mobile width, initially undefined
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create a media query list for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Function to update state based on window width
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Listen for viewport size changes
    mql.addEventListener("change", onChange)
    
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup listener when component unmounts
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array means this runs once on mount

  // Convert undefined/boolean to boolean (!! operator)
  return !!isMobile
}
