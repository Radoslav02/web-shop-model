// RegisterForm.tsx
import { SubmitHandler, useForm } from "react-hook-form";
import { auth, db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.css";

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

      await sendEmailVerification(user);

      await setDoc(doc(collection(db, "users"), user.uid), {
        name: data.name,
        surname: data.surname,
        email: data.email,
        place: data.place,
        postalCode: data.postalCode,
        street: data.street,
        number: data.number,
        phoneNumber: data.phoneNumber,
        isAdmin: false,
      });

      toast.success(
        "Registracija uspešna! Na Email ste dobili link za potvrdu registracije!"
      );
      navigate("/prijava");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Registracija neuspešna: ${error.message}`);
      } else {
        toast.error("Desila se greška. Molimo vas pokušajte ponovo!");
      }
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Registracija</h2>
        <div className="inputs-wrapper">
          <div className="register-wrapper">
            <div className="register-input-wrapper">
              <label>Ime:</label>
              <input
                className="register-input"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
            <div className="register-input-wrapper">
              <label>Prezime:</label>
              <input
                className="register-input"
                {...register("surname", { required: true })}
              />
              {errors.surname && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
          </div>
          <div className="register-wrapper">
            <div className="register-input-wrapper">
              <label>E-mail:</label>
              <input
                className="register-input"
                type="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
            <div className="register-input-wrapper">
              <label>Šifra:</label>
              <input
                className="register-input"
                type="password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
          </div>
          <div className="register-wrapper">
            <div className="register-input-wrapper">
              <label>Mesto stanovanja:</label>
              <input
                className="register-input"
                {...register("place", { required: true })}
              />
              {errors.place && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
            <div className="register-input-wrapper">
              <label>Poštanski broj:</label>
              <input
                className="register-input"
                {...register("postalCode", { required: true })}
              />
              {errors.postalCode && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
          </div>
          <div className="register-wrapper">
            <div className="register-input-wrapper">
              <label>Ulica:</label>
              <input
                className="register-input"
                {...register("street", { required: true })}
              />
              {errors.street && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
            <div className="register-input-wrapper">
              <label>Broj kuće/zgrade:</label>
              <input
                className="register-input"
                {...register("number", { required: true })}
              />
              {errors.number && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
          </div>
          <div className="register-wrapper">
            <div className="register-input-wrapper">
              <label>Broj telefona:</label>
              <input
                className="register-input"
                {...register("phoneNumber", { required: true })}
              />
              {errors.phoneNumber && (
                <span className="error">Ovo polje je obavezno</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <button className="register-page-button" type="submit">
            Registruj se
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;