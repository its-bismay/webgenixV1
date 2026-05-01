import { PricingTable } from "@clerk/nextjs"

const PricingComponent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] w-full">
      <h2 className="font-bold text-3xl my-5">Pricing</h2>
<div className="flex w-200">
      <PricingTable />
</div>


    </div>
  )
}
export default PricingComponent