import { FC, JSX } from "react"
import { NavLink } from "react-router-dom"

const NotFound: FC = (): JSX.Element => {
    return (
        <div className="text-center relative z-10">
            <h1 className="text-9xl font-bold text-teal-500 animate-pulse">
                404
            </h1>

            <p className="text-2xl mt-4 text-teal-600">
                Página no encontrada
            </p>
            <p className="text-2xl mt-4 text-teal-600">
                Lo sentimos, la página que estás buscando no existe.
            </p>

            <div className="mt-8 mx-auto w-64 h-64 md:w-96 md:h-96 relative">
                <img
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg"
                    alt="Imagen de Pexels"
                    className="w-full h-full rounded-lg shadow-2xl"
                />
            </div>
            <NavLink
                to={"/"}
                className="mt-6 inline-block px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-500 transform hover:scale-110 shadow-lg"
            >
                Volver al inicio
            </NavLink>
        </div>
    )
}
export default NotFound
