import React from "react";
import InvoiceLayout from "../components/Layout/InvoiceLayout";
import { formatNumberWithCommas, isDataUrl } from "../lib/helpers";
import { DATE_OPTIONS } from "../lib/variables";

const InvoiceTemplate2 = ({ data }) => {
    const { sender, receiver, details } = data;
    return (
        <InvoiceLayout data={data}>
            <div className="min-h-[800px] bg-white">
                {/* Header */}
                <div className="border-b-2 border-gray-200 pb-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            {details.invoiceLogo && (
                                <img
                                    src={details.invoiceLogo}
                                    width={120}
                                    height={80}
                                    alt={`Logo of ${sender.name}`}
                                    className="mb-3"
                                />
                            )}
                            <h1 className="text-2xl font-bold text-gray-900">{sender.name}</h1>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-light text-gray-700 mb-2">INVOICE</h2>
                            <div className="text-sm text-gray-600">
                                <p><span className="font-medium">Invoice #:</span> {details.invoiceNumber}</p>
                                <p><span className="font-medium">Date:</span> {new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}</p>
                                <p><span className="font-medium">Due:</span> {new Date(details.dueDate).toLocaleDateString("en-US", DATE_OPTIONS)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* From/To Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">From</h3>
                        <div className="text-gray-900">
                            <p className="font-medium">{sender.name}</p>
                            <p className="text-sm text-gray-600">{sender.address}</p>
                            <p className="text-sm text-gray-600">{sender.city}, {sender.zipCode}</p>
                            <p className="text-sm text-gray-600">{sender.country}</p>
                            <p className="text-sm text-gray-600 mt-2">{sender.email}</p>
                            <p className="text-sm text-gray-600">{sender.phone}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Bill To</h3>
                        <div className="text-gray-900">
                            <p className="font-medium">{receiver.name}</p>
                            <p className="text-sm text-gray-600">{receiver.address}</p>
                            <p className="text-sm text-gray-600">{receiver.city}, {receiver.zipCode}</p>
                            <p className="text-sm text-gray-600">{receiver.country}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 text-sm font-medium text-gray-500 uppercase tracking-wide">Description</th>
                                <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wide w-20">Qty</th>
                                <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wide w-24">Rate</th>
                                <th className="text-right py-3 text-sm font-medium text-gray-500 uppercase tracking-wide w-24">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.items.map((item, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            {item.description && (
                                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 text-right text-gray-900">{item.quantity}</td>
                                    <td className="py-4 text-right text-gray-900">{item.unitPrice} {details.currency}</td>
                                    <td className="py-4 text-right font-medium text-gray-900">{item.total} {details.currency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                    <div className="w-64">
                        <div className="space-y-2">
                            <div className="flex justify-between py-2">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium text-gray-900">
                                    {formatNumberWithCommas(Number(details.subTotal))} {details.currency}
                                </span>
                            </div>
                            {details.discountDetails?.amount > 0 && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-medium text-gray-900">
                                        {details.discountDetails.amountType === "amount"
                                            ? `- ${details.discountDetails.amount} ${details.currency}`
                                            : `- ${details.discountDetails.amount}%`}
                                    </span>
                                </div>
                            )}
                            {details.gstDetails?.rate > 0 && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">GST {details.gstDetails.rate}% ({details.gstDetails.inclusive ? 'Inclusive' : 'Exclusive'}):</span>
                                    <span className="font-medium text-gray-900">
                                        + {details.gstDetails.rate}%
                                    </span>
                                </div>
                            )}
                            {details.shippingDetails?.cost > 0 && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-medium text-gray-900">
                                        {details.shippingDetails.costType === "amount"
                                            ? `+ ${details.shippingDetails.cost} ${details.currency}`
                                            : `+ ${details.shippingDetails.cost}%`}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between py-2">
                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
                                    </span>
                                </div>
                                {details.totalAmountInWords && (
                                    <p className="text-sm text-gray-600 italic mt-1">
                                        {details.totalAmountInWords} {details.currency}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            {details.paymentTerms && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Payment Terms</h4>
                                    <p className="text-sm text-gray-600">{details.paymentTerms}</p>
                                </div>
                            )}
                            {details.additionalNotes && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                                    <p className="text-sm text-gray-600">{details.additionalNotes}</p>
                                </div>
                            )}
                        </div>
                        <div>
                            {details.paymentInformation?.bankName && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                                    <div className="text-sm text-gray-600">
                                        <p>Bank: {details.paymentInformation.bankName}</p>
                                        <p>Account: {details.paymentInformation.accountName}</p>
                                        <p>Number: {details.paymentInformation.accountNumber}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {details?.signature?.data && (
                        <div className="mt-8">
                            <h4 className="font-medium text-gray-900 mb-2">Signature</h4>
                            {isDataUrl(details.signature.data) ? (
                                <img
                                    src={details.signature.data}
                                    width={120}
                                    height={60}
                                    alt={`Signature of ${sender.name}`}
                                />
                            ) : (
                                <p
                                    style={{
                                        fontSize: 30,
                                        fontWeight: 400,
                                        fontFamily: `${details.signature.fontFamily}, cursive`,
                                        color: "black",
                                    }}
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

export default InvoiceTemplate2;
