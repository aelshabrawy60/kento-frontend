import { Link } from "react-router-dom";
import UserRegister from '../../components/UserRegister';


function ClientRegisterPage() {
  return (
    <div className='md:h-screen p-6 flex justify-center'>
        <div className='grid md:grid-cols-2 h-full max-w-300 gap-6'>
            <div className='flex items-center max-h-[200px] md:max-h-none overflow-hidden rounded-lg md:order-2'>
                <img src='/ClientRegister.jpg' className='w-full h-fit object-cover rounded-lg'/>
            </div>
            <div className='flex justify-center items-center gap-6 md:order-1'>
                <div className='max-w-96 w-full'>
                    <div className='mb-8'>
                        <div className='text-3xl md:text-4xl font-bold mb-4'>Register</div>
                        <p className='text-gray-600'>Today is a new day, Create new account</p>
                    </div>
                    <UserRegister type={"clients"}/>
                    <div className='flex justify-center mt-8'>
                        <div className='flex gap-1'>
                            <div>
                               Already Have an Account?
                            </div>
                            <Link className='text-blue-600' to={'/client/login'}>Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ClientRegisterPage