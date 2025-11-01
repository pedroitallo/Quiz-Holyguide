import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function DesignTab({ funnel, onChange }) {
  const [design, setDesign] = useState({
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    buttonColor: '#3b82f6',
    buttonTextColor: '#ffffff',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif'
  });

  const handleChange = (key, value) => {
    setDesign({ ...design, [key]: value });
    onChange();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Design do Funil
        </h2>
        <p className="text-slate-600">
          Customize as cores, fontes e estilos do seu funil
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cor Primária</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={design.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={design.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <Label>Cor Secundária</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={design.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={design.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>

              <div>
                <Label>Cor de Fundo</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={design.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={design.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <Label>Cor do Texto</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={design.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={design.textColor}
                    onChange={(e) => handleChange('textColor', e.target.value)}
                    placeholder="#1f2937"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Botões</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cor do Botão</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={design.buttonColor}
                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={design.buttonColor}
                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div>
                <Label>Cor do Texto do Botão</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={design.buttonTextColor}
                    onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={design.buttonTextColor}
                    onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Arredondamento de Bordas</Label>
              <Input
                type="text"
                value={design.borderRadius}
                onChange={(e) => handleChange('borderRadius', e.target.value)}
                placeholder="8px"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipografia</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Fonte</Label>
              <select
                value={design.fontFamily}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mt-2"
              >
                <option value="Inter, sans-serif">Inter</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Open Sans, sans-serif">Open Sans</option>
                <option value="Lato, sans-serif">Lato</option>
                <option value="Montserrat, sans-serif">Montserrat</option>
                <option value="Poppins, sans-serif">Poppins</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
