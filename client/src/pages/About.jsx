import React from 'react'

export default function About() {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>About CampusCrib Finder</h1>
      <section className='mb-5' id="project-overview">
            <h2 className='text-xl font-bold mb-3 text-slate-800' >Project Overview</h2>
            <p>Welcome to our project! We're excited to introduce you to our innovative solution for university students
                searching for off-campus housing. Our project focuses on the development of an intelligent web-based
                platform designed to streamline the house-hunting process and provide personalized recommendations for
                efficient tenant-property matching.</p>
        </section>

        <section className='mb-5' id="key-features">
            <h2 className='text-xl font-bold mb-4 text-slate-800'>Key Features</h2>
            <ul>
                <li>User-friendly interface for easy navigation and accessibility.</li>
                <li>User registration and profile creation to personalize the housing search experience.</li>
                <li>Property listing creation for landlords and property owners to showcase their rental properties.</li>
                <li>User preferences input to specify housing preferences, budget limits, and desired amenities.</li>
                <li>Recommendation algorithm to generate personalized housing recommendations based on user preferences
                    and property attributes.</li>
                <li>User feedback mechanisms to gather feedback and improve the platform over time.</li>
            </ul>
        </section>

        <section className='mb-5' id="why-choose-us">
            <h2 className='text-xl font-bold mb-4 text-slate-800'>Why Choose Our Platform</h2>
            <ul>
                <li>Comprehensive Solution: Our platform offers a one-stop solution for university students searching
                    for off-campus housing.</li>
                <li>Personalized Recommendations: With our recommendation algorithm, users receive personalized housing
                    recommendations tailored to their individual preferences and search criteria.</li>
                <li>User-Friendly Interface: We prioritize user experience and have designed our platform with a
                    user-friendly interface for easy navigation and accessibility.</li>
                <li>Continuous Improvement: We value user feedback and are committed to continuously improving our
                    platform to meet the evolving needs of university students.</li>
            </ul>
        </section>

        <section className='mb-5' id="join-us">
            <h2 className='text-xl font-bold mb-4 text-slate-800'>Join Us</h2>
            <p>We invite you to join us on our journey to revolutionize the off-campus housing experience for university
                students. Whether you're a student searching for housing or a landlord looking to list your rental
                properties, our platform offers a convenient and efficient solution for all your needs.</p>
        </section>
    </div>
  )
}
