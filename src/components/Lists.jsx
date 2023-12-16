import React from 'react'
import styles from "../styles/lists.module.css"
function Lists({task}) {
    console.log(task)
    const {completed , id , title } = task
  return (
    <div className={styles.name}>
       <h5>{title}</h5>
       
    </div>
  )
}

export default Lists