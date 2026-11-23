import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import ExploreCategories from "../../components/home/ExploreCategories"
import FeaturedCourses from "../../components/home/FeaturedCourses"
import Hero from "../../components/home/hero"
import HowBeharWorks from "../../components/home/HowBeharWorks"
import WhyBehar from "../../components/home/WhyBehar"
import MeetInstructors from "../../components/home/MeetInstructors"
import StudentStories from "../../components/home/StudentStories"

gsap.registerPlugin(ScrollTrigger)

function Home() {
  const homeRef = useRef(null)

  useLayoutEffect(() => {
    const root = homeRef.current
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined
    }

    const context = gsap.context(() => {
      gsap.utils.toArray("section", root).forEach((section) => {
        gsap.fromTo(
          section,
          { y: 48, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "bottom 10%",
              toggleActions: "restart none restart none",
            },
          }
        )
      })
    }, root)

    return () => context.revert()
  }, [])

  return (
    <div ref={homeRef}>
      <Hero />
      <ExploreCategories />
      <FeaturedCourses/>
      <HowBeharWorks/>
      <WhyBehar/>
       <MeetInstructors />
       
      <StudentStories />
    </div>
  )
}

export default Home
