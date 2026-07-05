import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) throw new Error('MONGO_URI is not set in .env')
    await mongoose.connect(uri)
    console.log('[db] connected to MongoDB')

    // Drop old text index if it has different fields, then recreate via Mongoose
    try {
      const Item = mongoose.model('Item')
      const indexes = await Item.collection.listIndexes().toArray()
      const oldTextIdx = indexes.find(
        idx => idx.textIndexVersion && idx.name !== 'corpus_text_index'
      )
      if (oldTextIdx) {
        await Item.collection.dropIndex(oldTextIdx.name)
        console.log('[db] dropped old text index:', oldTextIdx.name)
      }
    } catch (e) {
      // collection may not exist yet — that's fine
    }

  } catch (err) {
    console.error('[db] connection failed:', err.message)
    process.exit(1)
  }
}
