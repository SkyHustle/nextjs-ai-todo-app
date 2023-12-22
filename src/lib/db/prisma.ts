import { PrismaClient } from "@prisma/client"

// A function prismaClientSingleton is defined that creates a new instance of PrismaClient
const prismaClientSingleton = () => {
    return new PrismaClient()
}

// A type PrismaClientSingleton is defined as the return type of the prismaClientSingleton function
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

// globalForPrisma is defined as a global object that may have a prisma property of type PrismaClientSingleton
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined
}

// prisma is defined as the existing prisma property on the global object if it exists,
// otherwise a new PrismaClient instance is created by calling prismaClientSingleton()
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

// If the NODE_ENV environment variable is not set to "production",
// the prisma instance is attached to the global object.
// This is typically done to prevent multiple instances of PrismaClient in development,
//as Prisma suggests that you should avoid instantiating PrismaClient in every request due to connection overhead.
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}
