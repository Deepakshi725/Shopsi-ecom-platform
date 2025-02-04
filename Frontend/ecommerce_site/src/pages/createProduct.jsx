//eslint-disable-next-line
import React, { useState,useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import axios from "axios";

const CreateProduct = () => {
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [email, setEmail] = useState("");

    const categoriesData = [
        { title: "Electronics" },
        { title: "Fashion" },
        { title: "Books" },
        { title: "Home Appliances" },
    ];

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages((prevImages) => prevImages.concat(files));

        const imagePreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevPreviews) => prevPreviews.concat(imagePreviews));
    };

    useEffect(() => {
        // Cleanup object URLs to avoid memory leaks
        return () => {
            previewImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewImages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Hi")

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tags);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("email", email);

        images.forEach((image) => {
            formData.append("images", image);
        });


        const config = {
            headers: {
              "Content-Type": "multipart/form-data",
              "Accept": "any",
            },
          };
      
          axios.post("http://localhost:8000/api/v2/product/create-product", formData, config).then((res) => {
            console.log(res.data);
          }).catch((err) => {
            console.log(err);
          });

        // try {
        //     const response = await axios.post("http://localhost:8000/api/v2/product/create-product", formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //             "Accept": "any",
        //         },
        //     });

        //     if (response.status === 201) {
        //         alert("Product created successfully!");
        //         setImages([]);
        //         setName("");
        //         setDescription("");
        //         setCategory("");
        //         setTags("");
        //         setPrice("");
        //         setStock("");
        //         setEmail("");
        //     }
        // } catch (err) {
        //     console.error("Error creating product:", err);
        //     alert("Failed to create product. Please check the data and try again.");
        // }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-12 flex flex-col justify-center sm:px-6 lg:px-8">
        <div className="w-[90%] max-w-[600px] bg-white shadow h-auto rounded-[4px] p-4 mx-auto">
            <h5 className="mt-6 text-center text-3xl font-bold text-gray-900">Create Product</h5>
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={email}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter product name"
                        required
                    />
                </div>
                <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter product description"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option className="block text-sm font-medium text-gray-700" value="">Choose a category</option>
                        {categoriesData.map((i) => (
                            <option value={i.title} key={i.title}>
                                {i.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <input
                        type="text"
                        value={tags}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Enter product tags"
                    />
                </div>
                <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={price}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter product price"
                        required
                    />
                </div>
                <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                        Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={stock}
                        className="w-full p-2 border rounded"
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Enter stock quantity"
                        required
                    />
                </div>
                <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 p-1">
                        Upload Images <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        id="upload"
                        className="hidden"
                        multiple
                        onChange={handleImagesChange} // Corrected handler name
                        required
                    />
                    <label htmlFor="upload" className="cursor-pointer p-2">
                        <AiOutlinePlusCircle size={20} color="#555" />
                    </label>
                    <div className="flex flex-wrap mt-2">
                        {previewImages.map((img, index) => ( // Using previewImages
                            <img
                                src={img}
                                key={index}
                                alt="Preview"
                                className="w-[100px] h-[100px] object-cover m-2"
                            />
                        ))}
                    </div>
                </div>
                
                <button
                    type="submit"
                    className="w-full mt-4 bg-blue-500 text-white p-2 rounded"
                >
                    Create
                </button>
            </form>
        </div></div>
    );
};

export default CreateProduct;