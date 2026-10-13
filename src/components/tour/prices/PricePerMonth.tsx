import { Container } from "@/shared/ui";
import PricesTitle from "./PricesTitle";

const PricePerMonth = () => {
  return (
    <Container>
      <PricesTitle />
      <div className="w-full mx-auto mb-[100px]">
        {/* 📱 Мобильная версия */}
        <div className="md:hidden bg-white rounded-lg shadow overflow-hidden text-center text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-red-600 text-white">
                <th className="p-2 font-semibold">Період</th>
                <th className="p-2 font-semibold">Червень</th>
                <th className="p-2 font-semibold">Липень / Серпень</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="font-medium p-2">Вартість</td>
                <td className="p-2">460 €</td>
                <td className="p-2">485 €</td>
              </tr>
              <tr className="border-t">
                <td className="font-medium p-2">Виїзди</td>
                <td className="p-2">02.06, 16.06</td>
                <td className="p-2">
                  30.06, 14.07, 28.07, <span className="text-green-600 font-semibold">11.08</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex items-center gap-2 justify-center p-3 text-gray-800">
            <span className="w-3 h-3 bg-green-600 rounded-full inline-block" />
            <span className="font-semibold">Розпродаж – 418 €</span>
          </div>
        </div>

        {/* 💻 Десктопная версия */}
        <div className="hidden md:block bg-white overflow-hidden text-center text-base">
          <table className="w-full rounded-lg shadow">
            <thead className="bg-[#E43A3A] text-white">
              <tr className="">
                <th className="p-3 font-medium border-l border-white">Період</th>
                <th className="p-3 font-normal">Червень</th>
                <th className="p-3 font-normal">Липень / Серпень</th>
                <th className="p-3 font-normal">Вересень</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="font-medium p-3 bg-[#DBDBDB]">Вартість</td>
                <td className="p-3">460 €</td>
                <td className="p-3">485 €</td>
                <td className="p-3">468 €</td>
              </tr>
              <tr className="border-t">
                <td className="font-medium p-3 bg-[#DBDBDB]">Виїзди</td>
                <td className="p-3">02.06, 16.06</td>
                <td className="p-3">30.06, 14.07, 28.07, 11.08</td>
                <td className="p-3">
                  01.09, <span className="text-green-600 font-semibold">15.09*</span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex items-center gap-2 p-3 text-gray-800">
            <span className="w-3 h-3 bg-green-600 rounded-full inline-block" />
            <span className="font-semibold">15.09 Розпродаж – 418 €</span>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PricePerMonth;
