import bcryptjs from "bcryptjs";

const data = {
    users: [
        {
            
            name: 'Andrés',
            email: 'andresmmarolt@gmail.com',
            password: bcryptjs.hashSync('123456'),
            isAdmin: true
        },
        {
            name: 'Julieta',
            email: 'julietaespinosa@gmail.com',
            password: bcryptjs.hashSync('abcdef'),
            isAdmin: false
        }
    ],
    products: [
        {
            id: 1,
            name: 'Remera común',
            slug: 'Remera común',
            category: "Remeras",
            image: 'img/shirt1.webp',
            price: 4500,
            brand: 'Nike',
            rating: 4.0,
            numReviews: 0,
            stock: 20,
            description: 'Una remera popular'
        },
        {
            id: 2,
            name: 'Pantalón común',
            slug: 'Pantalón común',
            category: "Pantalones",
            image: 'img/jeans1.png',
            price: 6500,
            brand: 'Levis',
            rating: 4.3,
            numReviews: 2,
            stock: 11,
            description: 'Unos jeans geniales'
        },
        {
            id: 3,
            name: 'Sweater Twin Peaks',
            slug: 'Sweater Twin Peaks',
            category: "Sweaters",
            image: 'img/sweater1.jpg',
            price: 4500,
            brand: 'Sweat',
            rating: 3.8,
            numReviews: 1,
            stock: 2,
            description: 'Un sweater de Twin Peaks'
        }
    ]
}

export default data;