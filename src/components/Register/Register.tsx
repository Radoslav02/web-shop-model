// RegisterForm.tsx
import { SubmitHandler, useForm } from "react-hook-form";
import { auth, db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  place: string;
  postalCode: string;
  street: string;
  number: string;
  phoneNumber: string;
}

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Save user data in Firestore
      await setDoc(doc(collection(db, "users"), user.uid), {
        name: data.name,
        surname: data.surname,
        email: data.email,
        place: data.place,
        postalCode: data.postalCode,
        street: data.street,
        number: data.number,
        phoneNumber: data.phoneNumber,
        isAdmin: false, // Default value for new users
      });

      console.log("User successfully registered and data saved to Firestore.");
      alert("Registration successful! Check your email for verification.");
      navigate("/prijava");
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        alert(`Registration failed: ${error.message}`);
      } else {
        alert("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name:</label>
        <input {...register("name", { required: true })} />
        {errors.name && <span>Field is required</span>}
      </div>
      <div>
        <label>Surname:</label>
        <input {...register("surname", { required: true })} />
        {errors.surname && <span>Field is required</span>}
      </div>
      <div>
        <label>Email:</label>
        <input type="email" {...register("email", { required: true })} />
        {errors.email && <span>Field is required</span>}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" {...register("password", { required: true })} />
        {errors.password && <span>Field is required</span>}
      </div>
      <div>
        <label>Place:</label>
        <input {...register("place", { required: true })} />
        {errors.place && <span>Field is required</span>}
      </div>
      <div>
        <label>Postal Code:</label>
        <input {...register("postalCode", { required: true })} />
        {errors.postalCode && <span>Field is required</span>}
      </div>
      <div>
        <label>Street:</label>
        <input {...register("street", { required: true })} />
        {errors.street && <span>Field is required</span>}
      </div>
      <div>
        <label>Number:</label>
        <input {...register("number", { required: true })} />
        {errors.number && <span>Field is required</span>}
      </div>
      <div>
        <label>Phone Number:</label>
        <input {...register("phoneNumber", { required: true })} />
        {errors.phoneNumber && <span>Field is required</span>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
