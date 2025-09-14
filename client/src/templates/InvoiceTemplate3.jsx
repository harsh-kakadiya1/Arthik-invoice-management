import React from "react";
import InvoiceLayout from "../components/Layout/InvoiceLayout";
import { formatNumberWithCommas, isDataUrl } from "../lib/helpers";
import { DATE_OPTIONS } from "../lib/variables";

const InvoiceTemplate3 = ({ data }) => {
    const { sender, receiver, details } = data;
    return (
        <InvoiceLayout data={data}>
            <div className="min-h-[800px] bg-white">
                {/* Header with Company Info */}
                <div className="bg-gray-50 p-6 mb-6 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            {details.invoiceLogo && (
                                <img
                                    src={details.invoiceLogo}
                                    width={80}
                                    height={80}
                                    alt={`Logo of ${sender.name}`}
                                    className="rounded-lg"
                                />
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{sender.name}</h1>
                                <div className="text-sm text-gray-600 mt-1">
                                    <p>{sender.address}</p>
                                    <p>{sender.city}, {sender.zipCode}, {sender.country}</p>
                                    <p>{sender.email} | {sender.phone}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block">
                                <h2 className="text-xl font-bold">INVOICE</h2>
                            </div>
                            <div className="mt-3 text-sm">
                                <p className="font-semibold text-gray-900">#{details.invoiceNumber}</p>
                                <p className="text-gray-600">Date: {new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}</p>
                                <p className="text-gray-600">Due: {new Date(details.dueDate).toLocaleDateString("en-US", DATE_OPTIONS)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bill To Section */}
                <div className="mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">Bill To:</h3>
                        <div className="text-gray-900">
                            <p className="font-semibold text-lg">{receiver.name}</p>
                            <div className="text-sm text-gray-600 mt-1">
                                <p>{receiver.address}</p>
                                <p>{receiver.city}, {receiver.zipCode}</p>
                                <p>{receiver.country}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Items & Services</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700 w-20">Qty</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700 w-24">Rate</th>
                                    <th className="text-right py-3 px-4 font-semibold text-gray-700 w-28">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details.items.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center text-gray-900">{item.quantity}</td>
                                        <td className="py-4 px-4 text-right text-gray-900">{item.unitPrice} {details.currency}</td>
                                        <td className="py-4 px-4 text-right font-semibold text-gray-900">{item.total} {details.currency}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="flex justify-end mb-8">
                    <div className="w-80">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium text-gray-900">
                                        {formatNumberWithCommas(Number(details.subTotal))} {details.currency}
                                    </span>
                                </div>
                                {details.discountDetails?.amount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Discount:</span>
                                        <span className="font-medium text-red-600">
                                            {details.discountDetails.amountType === "amount"
                                                ? `- ${details.discountDetails.amount} ${details.currency}`
                                                : `- ${details.discountDetails.amount}%`}
                                        </span>
                                    </div>
                                )}
                                {details.taxDetails?.amount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax:</span>
                                        <span className="font-medium text-gray-900">
                                            {details.taxDetails.amountType === "amount"
                                                ? `+ ${details.taxDetails.amount} ${details.currency}`
                                                : `+ ${details.taxDetails.amount}%`}
                                        </span>
                                    </div>
                                )}
                                {details.shippingDetails?.cost > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="font-medium text-gray-900">
                                            {details.shippingDetails.costType === "amount"
                                                ? `+ ${details.shippingDetails.cost} ${details.currency}`
                                                : `+ ${details.shippingDetails.cost}%`}
                                        </span>
                                    </div>
                                )}
                                <div className="border-t border-gray-300 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-xl font-bold text-gray-900">Total:</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            {formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
                                        </span>
                                    </div>
                                    {details.totalAmountInWords && (
                                        <p className="text-sm text-gray-600 italic mt-2">
                                            {details.totalAmountInWords} {details.currency}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Information */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {details.paymentTerms && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Payment Terms</h4>
                                <p className="text-sm text-gray-600">{details.paymentTerms}</p>
                            </div>
                        )}
                        {details.additionalNotes && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
                                <p className="text-sm text-gray-600">{details.additionalNotes}</p>
                            </div>
                        )}
                        {details.paymentInformation?.bankName && (
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
                                <div className="text-sm text-gray-600">
                                    <p><span className="font-medium">Bank:</span> {details.paymentInformation.bankName}</p>
                                    <p><span className="font-medium">Account:</span> {details.paymentInformation.accountName}</p>
                                    <p><span className="font-medium">Number:</span> {details.paymentInformation.accountNumber}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {details?.signature?.data && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">Authorized Signature</h4>
                            {isDataUrl(details.signature.data) ? (
                                <img
                                    src={details.signature.data}
                                    width={150}
                                    height={75}
                                    alt={`Signature of ${sender.name}`}
                                    className="border-b border-gray-300 pb-2"
                                />
                            ) : (
                                <p
                                    style={{
                                        fontSize: 32,
                                        fontWeight: 400,
                                        fontFamily: `${details.signature.fontFamily}, cursive`,
                                        color: "black",
                                    }}
                                    className="border-b border-gray-300 pb-2 inline-block"
                                >
                                    {details.signature.data}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </InvoiceLayout>
    );
};

export default InvoiceTemplate3;
