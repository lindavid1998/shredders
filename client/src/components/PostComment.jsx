import React from 'react'
import Button from './Button'

const PostComment = () => {
  return (
		<form className='flex gap-2.5 h-11'>
			<input type='textarea' placeholder='Add a comment...' className='comment-textbox' />
			<Button type='submit' text='Post' color='tertiary' size='sm' />
		</form>
	);
}

export default PostComment