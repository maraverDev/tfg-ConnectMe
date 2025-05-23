<?php

return [
    'accepted'             => 'Debe ser aceptado.',
    'active_url'           => 'No es una URL válida.',
    'after'                => 'Debe ser una fecha posterior a :date.',
    'alpha'                => 'Solo se permiten letras.',
    'alpha_dash'           => 'Solo se permiten letras, números, guiones y guiones bajos.',
    'alpha_num'            => 'Solo se permiten letras y números.',
    'array'                => 'Debe ser un arreglo.',
    'before'               => 'Debe ser una fecha anterior a :date.',
    'between'              => [
        'numeric' => 'Debe ser un valor entre :min y :max.',
        'file'    => 'Debe ser un archivo de entre :min y :max kilobytes.',
        'string'  => 'Debe tener entre :min y :max caracteres.',
        'array'   => 'Debe tener entre :min y :max elementos.',
    ],
    'boolean'              => 'Debe ser verdadero o falso.',
    'confirmed'            => 'La confirmación no coincide.',
    'date'                 => 'No es una fecha válida.',
    'date_equals'          => 'Debe ser una fecha igual a :date.',
    'date_format'          => 'No coincide con el formato de fecha :format.',
    'different'            => 'Debe ser diferente de :other.',
    'digits'               => 'Debe tener :digits dígitos.',
    'digits_between'       => 'Debe tener entre :min y :max dígitos.',
    'dimensions'           => 'Las dimensiones de la imagen no son válidas.',
    'distinct'             => 'Este campo tiene un valor duplicado.',
    'email'                => 'Debe ser una dirección de correo válida.',
    'ends_with'            => 'Debe terminar con uno de los siguientes: :values.',
    'exists'               => 'El valor seleccionado no es válido.',
    'file'                 => 'Debe ser un archivo.',
    'filled'               => 'Este campo es obligatorio.',
    'gt'                   => [
        'numeric' => 'Debe ser mayor que :value.',
        'file'    => 'Debe ser mayor que :value kilobytes.',
        'string'  => 'Debe tener más de :value caracteres.',
        'array'   => 'Debe tener más de :value elementos.',
    ],
    'gte'                  => [
        'numeric' => 'Debe ser mayor o igual que :value.',
        'file'    => 'Debe ser mayor o igual que :value kilobytes.',
        'string'  => 'Debe tener :value o más caracteres.',
        'array'   => 'Debe tener :value o más elementos.',
    ],
    'image'                => 'Debe ser una imagen.',
    'in'                   => 'El valor seleccionado no es válido.',
    'in_array'             => 'Este valor no existe en :other.',
    'integer'              => 'Debe ser un número entero.',
    'ip'                   => 'Debe ser una dirección IP válida.',
    'ipv4'                 => 'Debe ser una dirección IPv4 válida.',
    'ipv6'                 => 'Debe ser una dirección IPv6 válida.',
    'json'                 => 'Debe ser una cadena JSON válida.',
    'lt'                   => [
        'numeric' => 'Debe ser menor que :value.',
        'file'    => 'Debe ser menor que :value kilobytes.',
        'string'  => 'Debe tener menos de :value caracteres.',
        'array'   => 'Debe tener menos de :value elementos.',
    ],
    'lte'                  => [
        'numeric' => 'Debe ser menor o igual que :value.',
        'file'    => 'Debe ser menor o igual que :value kilobytes.',
        'string'  => 'Debe tener :value o menos caracteres.',
        'array'   => 'Debe tener :value o menos elementos.',
    ],
    'max'                  => [
        'numeric' => 'No debe ser mayor que :max.',
        'file'    => 'No debe ser mayor que :max kilobytes.',
        'string'  => 'No debe tener más de :max caracteres.',
        'array'   => 'No debe tener más de :max elementos.',
    ],
    'mimes'                => 'Debe ser un archivo de tipo: :values.',
    'mimetypes'            => 'Debe ser un archivo de tipo: :values.',
    'min'                  => [
        'numeric' => 'Debe ser al menos :min.',
        'file'    => 'Debe ser al menos :min kilobytes.',
        'string'  => 'Debe tener al menos :min caracteres.',
        'array'   => 'Debe tener al menos :min elementos.',
    ],
    'not_in'               => 'El valor seleccionado no es válido.',
    'numeric'              => 'Debe ser un número.',
    'password'             => 'La contraseña debe tener al menos 6 caracteres.',
    'present'              => 'Este campo debe estar presente.',
    'regex'                => 'El formato no es válido.',
    'required'             => 'Este campo es obligatorio.',
    'required_if'          => 'Este campo es obligatorio cuando :other es :value.',
    'required_unless'      => 'Este campo es obligatorio a menos que :other esté en :values.',
    'required_with'        => 'Este campo es obligatorio cuando :values está presente.',
    'required_with_all'    => 'Este campo es obligatorio cuando :values están presentes.',
    'required_without'     => 'Este campo es obligatorio cuando :values no está presente.',
    'required_without_all' => 'Este campo es obligatorio cuando ninguno de los :values está presente.',
    'same'                 => 'Este campo y :other deben coincidir.',
    'size'                 => [
        'numeric' => 'Debe ser :size.',
        'file'    => 'Debe tener :size kilobytes.',
        'string'  => 'Debe tener :size caracteres.',
        'array'   => 'Debe contener :size elementos.',
    ],
    'starts_with'          => 'Debe comenzar con uno de los siguientes: :values.',
    'string'               => 'Debe ser una cadena de texto.',
    'timezone'             => 'Debe ser una zona horaria válida.',
    'unique'               => 'Este usuario ya ha sido registrado.',
    'uploaded'             => 'No se pudo cargar el archivo.',
    'url'                  => 'El formato de la URL no es válido.',
    'uuid'                 => 'Debe ser un UUID válido.',
];
