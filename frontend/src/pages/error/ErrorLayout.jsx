import { Link } from 'react-router-dom';

/**
 * @param {object} props
 * @param {string} props.code
 * @param {string} props.title
 * @param {string} props.message
 * @param {{to: string, text: string}} props.action
 */
const ErrorLayout = ({ code, title, message, action }) => {
  let bgColor1, bgColor2;
  switch (code) {
    case '401':
      bgColor1 = 'bg-red-200';
      bgColor2 = 'bg-pink-200';
      break;
    case '403':
      bgColor1 = 'bg-gray-300';
      bgColor2 = 'bg-red-200';
      break;
    case '404':
    default:
      bgColor1 = 'bg-yellow-200';
      bgColor2 = 'bg-orange-200';
      break;
  }

  return (
    <main className="relative bg-gray-50 min-h-[calc(100vh-80px)] flex justify-center items-center p-6 overflow-hidden">
      <div className={`absolute -top-20 -left-20 w-72 h-72 ${bgColor1} rounded-full opacity-50 blur-3xl -z-0`} />
      <div className={`absolute -bottom-20 -right-20 w-80 h-80 ${bgColor2} rounded-full opacity-50 blur-3xl -z-0`} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-200 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2 -z-0" />

      <div className="relative z-10 flex flex-col items-center text-center p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800">
          <span className="text-orange-400">{code}</span>
          <span className="text-green-600">{title}</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-2xl">
          {message}
        </p>

        <div className="mt-10">
          <Link
            to={action.to}
            className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-full text-lg sm:text-xl px-8 py-4 shadow-lg shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            {action.text}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorLayout;
