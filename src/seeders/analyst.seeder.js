import bcrypt from 'bcryptjs'
import { Analyst } from '../models/index.js'

const seedAnalyst = async () => {
  try {
    const existing = await Analyst.findOne({ 
      where: { email: 'analyst@novapay.com' } 
    })

    if (existing) {
      console.log('Analyst already exists')
      return
    }

    const hashedPassword = await bcrypt.hash('1234', 10)

    await Analyst.create({
      name: 'Ana García',
      email: 'analyst@novapay.com',
      password: hashedPassword,
      role: 'analyst'
    })

    console.log('Analyst seeded successfully')
  } catch (error) {
    console.error('Seed error:', error.message)
  }
}

export default seedAnalyst