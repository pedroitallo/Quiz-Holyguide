import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Heart, User, Calendar, Target } from "lucide-react";

export default function PersonalForm({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birth_date: "",
    love_goal: ""
  });

  const [currentField, setCurrentField] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    {
      key: "name",
      label: "Qual é o seu nome?",
      icon: User,
      type: "input",
      placeholder: "Digite seu nome completo"
    },
    {
      key: "gender",
      label: "Como você se identifica?",
      icon: Heart,
      type: "select",
      options: [
        { value: "feminino", label: "Feminino" },
        { value: "masculino", label: "Masculino" },
        { value: "outro", label: "Outro" }
      ]
    },
    {
      key: "birth_date",
      label: "Qual é sua data de nascimento?",
      icon: Calendar,
      type: "date",
      placeholder: "DD/MM/AAAA"
    },
    {
      key: "love_goal",
      label: "Qual é seu objetivo amoroso?",
      icon: Target,
      type: "select",
      options: [
        { value: "encontrar_alma_gemea", label: "Encontrar minha alma gêmea" },
        { value: "melhorar_relacionamento", label: "Melhorar meu relacionamento atual" },
        { value: "reconectar_com_ex", label: "Me reconectar com um amor do passado" },
        { value: "descobrir_proposito", label: "Descobrir meu propósito amoroso" }
      ]
    }
  ];

  const currentFieldData = fields[currentField];

  const handleFieldUpdate = (value) => {
    const updatedData = { ...formData, [currentFieldData.key]: value };
    setFormData(updatedData);

    // Auto-advance to next field after selection
    setTimeout(() => {
      if (currentField < fields.length - 1) {
        setCurrentField(currentField + 1);
      } else {
        handleSubmit(updatedData);
      }
    }, 500);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    await onFormSubmit(data);
  };

  if (isSubmitting) {
    return (
      <div className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Consultando o universo...
          </h2>
          <p className="text-gray-600">
            Estamos interpretando suas energias e preparando sua leitura personalizada
          </p>
        </motion.div>
      </div>
    );
  }

  const IconComponent = currentFieldData.icon;

  return (
    <div className="text-center py-8">
      <motion.div
        key={currentField}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
            {currentFieldData.label}
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Essas informações nos ajudam a personalizar sua leitura espiritual
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {currentFieldData.type === "input" && (
            <Input
              type="text"
              placeholder={currentFieldData.placeholder}
              value={formData[currentFieldData.key]}
              onChange={(e) => handleFieldUpdate(e.target.value)}
              className="text-lg py-4 px-6 rounded-full border-2 border-purple-200 focus:border-purple-500 text-center"
              autoFocus
            />
          )}

          {currentFieldData.type === "date" && (
            <Input
              type="date"
              value={formData[currentFieldData.key]}
              onChange={(e) => handleFieldUpdate(e.target.value)}
              className="text-lg py-4 px-6 rounded-full border-2 border-purple-200 focus:border-purple-500 text-center"
              autoFocus
            />
          )}

          {currentFieldData.type === "select" && (
            <Select onValueChange={handleFieldUpdate}>
              <SelectTrigger className="text-lg py-4 px-6 rounded-full border-2 border-purple-200 focus:border-purple-500">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                {currentFieldData.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Pergunta {currentField + 1} de {fields.length}
        </div>
      </motion.div>
    </div>
  );
}