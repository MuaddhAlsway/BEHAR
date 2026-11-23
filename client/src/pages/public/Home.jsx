import { lazy, Suspense, useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import "../../styles/home-loading.css"

const ExploreCategories = lazy(() => import("../../components/home/ExploreCategories"))
const FeaturedCourses = lazy(() => import("../../components/home/FeaturedCourses"))
const Hero = lazy(() => import("../../components/home/Hero"))
const HowBeharWorks = lazy(() => import("../../components/home/HowBeharWorks"))
const WhyBehar = lazy(() => import("../../components/home/WhyBehar"))
const MeetInstructors = lazy(() => import("../../components/home/MeetInstructors"))
const StudentStories = lazy(() => import("../../components/home/StudentStories"))

gsap.registerPlugin(ScrollTrigger)

function HomeSectionSkeleton({ variant = "default" }) {
  return (
    <div
      className={`behar-home-skeleton behar-home-skeleton--${variant}`}
      aria-hidden="true"
    >
      <span className="behar-home-skeleton__eyebrow" />
      <span className="behar-home-skeleton__title" />
      <span className="behar-home-skeleton__line" />
      <span className="behar-home-skeleton__line behar-home-skeleton__line--short" />
      <div className="behar-home-skeleton__grid">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function LazySection({ children, variant }) {
  return (
    <Suspense fallback={<HomeSectionSkeleton variant={variant} />}>
      {children}
    </Suspense>
  )
}

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
      <LazySection variant="hero"><Hero /></LazySection>
      <LazySection variant="categories"><ExploreCategories /></LazySection>
      <LazySection variant="courses"><FeaturedCourses /></LazySection>
      <LazySection variant="process"><HowBeharWorks /></LazySection>
      <LazySection variant="why"><WhyBehar /></LazySection>
      <LazySection variant="faculty"><MeetInstructors /></LazySection>
      <LazySection variant="stories"><StudentStories /></LazySection>
    </div>
  )
}

export default Home
