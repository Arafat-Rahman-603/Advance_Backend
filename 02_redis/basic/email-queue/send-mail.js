export default async function sendMail({ email }) {
    return new Promise((resolve, reject) => {
        console.log("Processing mail for", email)

        setTimeout(() => {
            console.log("Mail sent to", email)
            resolve()
        }, 5000)
    })
}
