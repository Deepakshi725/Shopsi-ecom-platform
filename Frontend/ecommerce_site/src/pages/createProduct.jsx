//eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";
import Nav from "../components/nav";
import { server } from '../server';

const CreateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

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

    useEffect(() => {
        if (isEdit) {
            axios
                .get(`http://localhost:8000/api/v2/product/product/${id}`)
                .then((response) => {
                    const p = response.data.product;
                    setName(p.name);
                    setDescription(p.description);
                    setCategory(p.category);
                    setTags(p.tags || "");
                    setPrice(p.price);
                    setStock(p.stock);
                    setEmail(p.email);
                    if (p.images || p.images.length > 0) {
                        setPreviewImages(
                            p.images.map((imgPath) => `http://localhost:8000${imgPath}`)
                        );
                    }
                })
                .catch((err) => {
                    console.error("Error fetching product:", err);
                });
        }
    }, [id, isEdit]);


    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);

        setImages((prevImages) => prevImages.concat(files));

        const imagePreviews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages((prevPreviews) => prevPreviews.concat(imagePreviews));
    };

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


        // const config = {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //       "Accept": "any",
        //     },
        //   };
      
        //   axios.post("http://localhost:8000/api/v2/product/create-product", formData, config).then((res) => {
        //     console.log(res.data);
        //   }).catch((err) => {
        //     console.log(err);
        //   });

        try {
            if (isEdit) {
                const response = await axios.put(
                    `http://localhost:8000/api/v2/product/update-product/${id}`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                if (response.status === 200) {
                    alert("Product updated successfully!");
                    navigate("/myproducts");
                }
            } else {
                const response = await axios.post(
                    "http://localhost:8000/api/v2/product/create-product",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                if (response.status === 201) {
                    alert("Product created successfully!");
                    setImages([]);
                    setPreviewImages([]);
                    setName("");
                    setDescription("");
                    setCategory("");
                    setTags("");
                    setPrice("");
                    setStock("");
                    setEmail("");
                }
            }
        } catch (err) {
            console.error("Error creating/updating product:", err);
            alert("Failed to save product. Please check the data and try again.");
        }
    };

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-[#222831] px-6 py-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-[#EEEEEE] mb-8">
                        {isEdit ? "Edit Product" : "Create New Product"}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="bg-[#31363F] rounded-xl shadow-lg p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email Field */}
                            <div className="col-span-2">
                                <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            {/* Name Field */}
                            <div className="col-span-2">
                                <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                                    Product Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>

                            {/* Description Field */}
                            <div className="col-span-2">
                                <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter product description"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>

                            {/* Category Field */}
                            <div>
                                <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                                    Category <span className="text-red-400">*</span>
                                </label>
                                <select
                                    className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a category</option>
                                    {categoriesData.map((i) => (
                                        <option value={i.title} key={i.title}>
                                            {i.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags Field */}
                            <div>
                                <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                                    Tags
                                </label>
                                <input
                                    type="text"
                                    value={tags}
                                    className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="Enter tags (comma separated)"
                                />
                            </div>

                            {/* Price Field */}
                            <div>
                                <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                                    Price <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="Enter price"
                                    required
                                />
                            </div>

                            {/* Stock Field */}
                            <div>
                                <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                                    Stock <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={stock}
                                    className="w-full p-3 bg-[#222831] border border-[#76ABAE] rounded-lg text-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-[#76ABAE]"
                                    onChange={(e) => setStock(e.target.value)}
                                    placeholder="Enter stock quantity"
                                    required
                                />
                            </div>

                            {/* Image Upload Field */}
                            <div className="col-span-2">
                                <label className="block text-[#EEEEEE] text-sm font-medium mb-2">
                                    Product Images <span className="text-red-400">*</span>
                                </label>
                                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-[#76ABAE] border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <AiOutlinePlusCircle className="mx-auto h-12 w-12 text-[#76ABAE]" />
                                        <div className="flex text-sm text-[#EEEEEE]">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md font-medium text-[#76ABAE] hover:text-[#5b8d90] focus-within:outline-none"
                                            >
                                                <span>Upload images</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    multiple
                                                    onChange={handleImagesChange}
                                                    required={!isEdit}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-[#EEEEEE]">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {previewImages.length > 0 && (
                                <div className="col-span-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {previewImages.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-24 object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                type="submit"
                                className="bg-[#76ABAE] hover:bg-[#5b8d90] text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all text-lg"
                            >
                                {isEdit ? "Update Product" : "Create Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;