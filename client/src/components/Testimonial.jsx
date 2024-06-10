import React from 'react'

const Testimonial = ({ content, author }) => {
  return (
		<div className='flex flex-col justify-between w-80 bg-light p-5 rounded-lg drop-shadow-lg h-96'>
			<h6 className='w-full tracking-normal'>{content}</h6>
			<h6 className='w-full font-bold text-right tracking-normal'>{author}</h6>
		</div>
	);
}

export default Testimonial